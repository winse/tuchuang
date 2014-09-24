(function ($) {

    var defaults = {
        "app_key": "f3075b4f9a8ce250d0ca9d4277c0e93d",
        "rest_key": "3361dd2e60583501885c1acfeb605ac2"
    }

    var BmobChrome = {
        initialize: function (appid, restkey) {
            Bmob.app_key = appid;
            Bmob.rest_key = restkey;
        },
        File: function (title, data) {
            return {
                save: function (fSucess, fError) {
                    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                        ajax_req = new XMLHttpRequest();
                    }
                    else {// code for IE6, IE5
                        ajax_req = new ActiveXObject("Microsoft.XMLHTTP");
                    }

                    try {
                        ajax_req.open("POST", 'https://api.bmob.cn/1/files/' + Base64.encode(title), false);
                        ajax_req.setRequestHeader("X-Bmob-Application-Id", Bmob.app_key);
                        ajax_req.setRequestHeader("X-Bmob-REST-API-Key", Bmob.rest_key);
                        ajax_req.send(data);

                        var response = ajax_req.responseText;
                        console.log(response);
                        fSucess($.parseJSON(response));
                    } catch (e) {
                        fError(e);
                    }
                }
            }
        }
    }

    $.flickr = function (opts) {
        var self = {},
            options = $.extend(true, {}, defaults, opts);

        self.options = options;

        self.loginClient = function () {
            Bmob.initialize(options.app_key, options.rest_key);
            BmobChrome.initialize(options.app_key, options.rest_key);
        };

        self.photo = function (photoId, callback) {
            callback(photoId);
        }

        function throwIfError($data) {
            var $err = $data.find("err");
            if ($err.length > 0) {
                alert("获取数据失败，错误： " + $err.attr("msg"));
            }
        }

        self.upload = function (blob, callbacks) {
            self.loginClient();

            var json = {
                "title": "截图上传-" + new Date().getTime() + ".png",//format(),
                "description": "",
                "tags": "snapshot"
            };

            callbacks.before();
            var file = new BmobChrome.File(json.title, blob);
            file.save(function (obj) {
                var url = "http://file.bmob.cn/" + obj.url;
                console.log(url);
                self.save(url, callbacks.finish);
            }, function (error) {
                alert("上传失败！！");
                callbacks.finish("");
            });

        }

        self.save = function (path, callback) {
            var ImageURL = Bmob.Object.extend("t_image_url");

            var imageUrl = new ImageURL();
            imageUrl.set("path", path);
            //添加数据，第一个入口参数是null
            imageUrl.save(null, {
                success: function (data) {
                    callback(path);
                },
                error: function (data, error) {
                    alert('上传成功，添加数据失败，返回错误信息：' + error.description);
                    callback("");
                }
            });

        }

        self.list = function ($more, page, pagesize) {
            self.loginClient();

            var ImageURL = Bmob.Object.extend("t_image_url");
            var query = new Bmob.Query(ImageURL);

            var start = page ? (page - 1) * pagesize : 0;
            pagesize = pagesize || 20;

            query.skip(start)
            query.limit(pagesize);
            query.descending('updatedAt');

            // 查询所有数据
            query.find({
                success: function (results) {
                    console.log("共查询到 " + results.length + " 条记录");
                    if (results.length < pagesize) {
                        $more.hide();
                    } else {
                        // 循环处理查询到的数据
                        for (var i = 0; i < results.length; i++) {
                            var object = results[i];
                            console.log(object.toJSON());

                            $("<li><img src='" + object.get('path') + "'></li>").insertBefore($more);
                            $more.attr("page", page);
                        }
                    }
                },
                error: function (error) {
                    alert("查询失败: " + error.code + " " + error.message);
                }
            });

        }

        return self;
    }

}(jQuery));