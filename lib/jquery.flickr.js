(function ($) {

    var defaults = {
        "rest": "https://api.flickr.com/services/rest/",

        "api_key": "9ba2a3c58259dfb4a0f8081c712a7828",
        "api_secret": "23aafc10adcd3d48",

        "auth_key": "Flickr_AUTH_KEY",
        "user_id_key": "Flickr_AUTH_USER",
        "frob_key": "Flickr_FROB_KEY"
    }

    $.flickr = function (opts) {

        var self = {},
            options = $.extend(true, {}, defaults, opts),
            sig,
            auth_value;

        self.options = options;

        self.loginClient = function () {
            var params = { "method": "flickr.auth.getFrob" }

            request(sig(params), function ($data) {
                var frob = $data.find("frob").text();

                $.store.set(options.frob_key, frob);

                var args = { "perms": "write", "frob": frob };
                args = sig(args);

                // 间接调用open会被chrome拦截！
                var $link = $("<a />");
                $link.attr("href", "#").css("display", "none").appendTo($("body"));
                $link.click(function () {
                    var win = window.open("http://flickr.com/services/auth/?" + $.param(args), '_blank');
                    win.focus();

                    $link.remove();
                });
                $link.click();
            });

        };

        self.getToken = function (callback) {
            var params = { "method": "flickr.auth.getToken", "frob": $.store.get(options.frob_key) }

            request(sig(params), function ($data) {
                    var token = $data.find("token").text();
                    var userid = $data.find("user").attr("nsid");

                    $.store.set(options.auth_key, token);
                    $.store.set(options.user_id_key, userid);

                    callback();
                }
            );

        };

        var auth_value = function () {
            return $.store.get(options.auth_key);
        }

        var sig = function (params) {
            params["api_key"] = options.api_key;

            var result = {};
            var baseString = options.api_secret;
            $.each(Object.keys(params).sort(), function (index, key) {
                var value = params[key];
                if (value) {
                    baseString += key + params[key];
                    result[key] = params[key];
                }
            });
            result["api_sig"] = $.md5(baseString);// signature

            return result;
        };

        // 在Flickr的APP中需要设置callback_url
        self.loginWebUrl = function () {
            var params = { perms: "write" };
            return "http://flickr.com/services/auth/?" + $.param(sig(params));
        }

        // http://www.flickr.com/services/api/auth.spec.html
        self.loginWeb = function (frob, callback) {
            var params = {
                "method": "flickr.auth.getToken",
                "frob": frob
            };

            request(sig(params), function ($data) {
                var _res = $data.find("token").text();

                $.store.set(options.auth_key, _res);

                callback(_res);
            });

        }

        self.user = function (callback) {
            var params = {
                "method": "flickr.people.getInfo",
                "user_id": $.store.get(options.user_id_key)
            };

            request(sig(params), function ($data) {
                if ($data) {
                    var username = $data.find("username").text();
                    var $person = $data.find("person");
                    var iconFarm = $person.attr("iconfarm");
                    var iconserver = $person.attr("iconserver");
                    var nsid = $person.attr("nsid");

                    callback({
                        "username": username,
                        "icon": "http://farm" + iconFarm + ".staticflickr.com/" + iconserver + "/buddyicons/" + nsid + ".jpg"
                    });
                }
            });

        }

        self.shortlink = function (photoId) {
            return "http://flic.kr/p/" + $.base58.encode(photoId);
        }

        /**
         * // @see http://www.flickr.com/services/api/misc.urls.html
         *
         * e.g.
         * http://www.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=a723b32ad0489723123718e361bc87eb&photo_id=12428923175
         */
        self.photo = function (photoId, callback) {
            var params = { "method": "flickr.photos.getSizes", "photo_id": photoId };

            request(sig(params), function ($data) {
                var $node = $data.find("size[label=Original]");
                callback($node.attr("source"))
            });

        }

        function throwIfError($data) {
            var $err = $data.find("err");
            if ($err.length > 0) {
                alert("获取数据失败，错误： " + $err.attr("msg"));
            }
        }

        function request(params, callback) {
            /**
             * `dateType: text` 指定获取原始值
             */
            $.ajax({url: options.rest, data: params, dataType: "xml", async: false })
                .done(function (data) {
                    var $data = $(data);

                    throwIfError($data);

                    callback($data);
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown);
                });
        };

        self.upload = function (blob, callbacks) {
            var accessToken = auth_value();
            if (!accessToken) {
                alert("上传图片需flickr认证，点击右上角的·Sign in·按钮！");
                return false;
            }

            var json = {
                "batch_id": "",
                "async": 0, // set to 1 for async mode, 0 for sync mode
                "title": "截图上传-" + new Date().getTime(),//format(),
                "description": "",
                "tags": "snapshot",
                "is_public": 1,// 0 表示否，1 表示是
                "is_friend": 1,
                "is_family": 1,
                "safety_level": 0,//  1 為「安全級」、2 為「輔導級」、3 為「限制級」
                "content_type": 0,
                "hidden": 1,
                "auth_token": accessToken
            };

            var form = new FormData();
            $.each(sig(json), function (key, value) {
                if (value)
                    form.append(key, value);
            });
            form.append("photo", blob);

            /**
             *@see https://api.jquery.com/jQuery.ajax/
             * processData 告诉jQuery不要去处理发送的数据
             * contentType 告诉jQuery不要去设置Content-Type请求头。或者设置contentType: 'multipart/form-data'
             */
            $.ajax({
                url: "https://up.flickr.com/services/upload/",
                data: form,
                async: true,
                processData: false,
                contentType: false,
                type: "POST",
                beforeSend: callbacks.before })
                .done(function (data) {
                    var $data = $(data);

                    throwIfError($data);

                    var phoneid = $data.find("photoid").text();
                    callbacks.finish(phoneid);
                })
                .fail(function () {
                    alert("上传失败！！");
                });

        }

        return self;
    }

}(jQuery));