/**
 * Created by leeshine on 15/1/30.
 */
// var rbBaseUrl = 'http://api.readbox.in';
var rbBaseUrl = 'http://readboxapi.tuishiben.com';
var jwt = window.localStorage.getItem('readbox_jwt');
function base64_encode(str) {
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}
function removeScriptCode(html) {
    html = html.replace(/<script.*<\/script>/ig, '');
    return html;
}
function removeHtmlTag(html) {
    html = html.replace(/<[^>]*>/ig, '');
    return html;
}
$(document).ready(function(){
    $('#btnGotoRegister').click(function(){
        $('.loginWrap').animate({left:'-200px'});
    });
    $('#btnLogin').click(function(){
        $('#error').html('').hide();
        var loginname = $.trim($('#loginname').val());
        var pwd = $('#pwd').val();
        pwd =  base64_encode(pwd);

        if(loginname==''){
            $('#error').html('need phone or email!').show();
            return;
        }
        if(pwd==''){
            $('#error').html('need password!').show();
            return;
        }
        $('#error').html('').hide();
        $.ajax({
            type: "POST",
            url: rbBaseUrl+'/user/login',
            data: {loginName:loginname,pwd:pwd},
            dataType: 'json',
            success: function (res) {
                if(res.result=='TRUE'){
                    jwt = res.jwt;
                    window.localStorage.setItem('readbox_jwt',jwt);
                    window.close();
                }else{
                    $('#error').html("(;´༎ຶД༎ຶ`) something wrong!").show();
                }
            },
            error:function(){
                $('#error').html("(;´༎ຶД༎ຶ`) something wrong!").show();
            }
        });
    });
    $('#btnRegister').click(function(){
        $('#error').html('').hide();
        var loginname = $.trim($('#regLoginname').val());
        var pwd = $('#regPwd').val();
        pwd =  base64_encode(pwd);
        var nickname = $.trim($('#nickname').val());
        nickname = removeScriptCode(nickname);
        nickname = removeHtmlTag(nickname);

        if(loginname==''){
            $('#error').html('need phone or email!').show();
            return;
        }
        if(pwd==''){
            $('#error').html('need password!').show();
            return;
        }
        if(nickname==''){
            $('#error').html('need nickname!').show();
            return;
        }

        $('#error').html('').hide();
        $.ajax({
            type: "POST",
            url: rbBaseUrl+'/user/register',
            data: {loginName:loginname,pwd:pwd,nickname:nickname},
            dataType: 'json',
            success: function (res) {
                if(res.result=='TRUE'){
                    jwt = res.jwt;
                    window.localStorage.setItem('readbox_jwt',jwt);
                    window.close();
                }else{
                    $('#error').html("(;´༎ຶД༎ຶ`) something wrong!").show();
                }
            },
            error:function(){
                $('#error').html("(;´༎ຶД༎ຶ`) something wrong!").show();
            }
        });
    });
    chrome.tabs.getSelected(function(tab){
        if(jwt&&jwt!=''){
            $('.loginContainer').hide();
            $('#divPost').show();
            $.ajax({
                type: "POST",
                url: rbBaseUrl+'/article/add',
                data: {url:tab.url},
                dataType: 'json',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("x-json-web-token", jwt);
                },
                success: function (res) {
                    if(res.result=='TRUE'){
                        $('.loading-indicator').html("(＝^ω^＝) done.");
                        setTimeout(function(){
                            window.close();
                        },1500)
                    }else{
                        $('.loading-indicator').html("(;´༎ຶД༎ຶ`) something wrong!");
                    }
                },
                error:function(){
                    $('.loading-indicator').html("(;´༎ຶД༎ຶ`) something wrong!");
                }
            });
        }else{
            $('.loginContainer').show();
            $('#divPost').hide();
        }
    });

});