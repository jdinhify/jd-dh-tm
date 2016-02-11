'use strict';

var moment = require('moment');

moment.locale('vi', {
    months: [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ],
    weekdaysShort: ['CN', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy']
});

/* eslint-enable */

var config = {
    language : {
        vi:{
            Logout: 'Thoát',
            Login: 'Đăng nhập',
            Edit: 'Sửa',
            Save: 'Lưu',
            Delete: 'Xoá',
            Cancel: 'Huỷ',
            Client: 'Đối tác',
            Type: 'Loại',
            Date: 'Ngày',
            Time: 'Giờ',
            Departure: 'Đi',
            Return: 'Về',
            Action: 'Thao tác',
            '7s': '7 chỗ',
            '16s': '16 chỗ',
            hour: 'giờ',
            min: 'phút',
            Create: 'Tạo',
            Filter: 'Chọn',
            From: 'Từ',
            To: 'Đến',
            'Create new': 'Tạo mới',
            'Time period': 'Thời gian',
            Settings: 'Thiết lập',
            View: 'Hiển thị',
            Displaying: 'Đang hiển thị',
            Options: 'Tuỳ chọn',
            Cost: 'Tiền',
            Driver: 'Lái xe'
        }
    },
    locale: 'vi',
    getText: function(lang, locale, key) {
        return lang[locale][key] ? lang[locale][key] : key;
    }
};

module.exports = config;
