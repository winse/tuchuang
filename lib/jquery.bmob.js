(function ($) {

    var defaults = {
        "app_key": "f3075b4f9a8ce250d0ca9d4277c0e93d",
        "rest_key": "3361dd2e60583501885c1acfeb605ac2"
    }

    $.flickr = function (opts) {

        var self = {},
            options = $.extend(true, {}, defaults, opts);

        self.options = options;

        self.loginClient = function () {
            Bmob.initialize(options.app_key, options.rest_key);
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

            var reader = new FileReader();
            reader.onloadend = function () {
                callbacks.before();

                var file = new Bmob.File(json.title, reader.result);
                file.save().then(function (obj) {
                    console.log(obj.url());
                    self.save(obj.url(), callbacks.finish);
                }, function (error) {
                    alert("上传失败！！");
                    callbacks.finish("");
                });
            };
            reader.readAsBinaryString(blob);

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

        return self;
    }

}(jQuery));