import { notification } from "antd";

const useNotification = () => {
    const [api, contextHolder] = notification.useNotification();
    const duration = 3;

    const success = (description) => {
        api['success']({
            message: 'Thành công',
            description: description,
            duration: duration
        });
    }

    const info = (description) => {
        api['info']({
            message: 'Thông tin',
            description: description,
            duration: duration
        });
    }

    const warning = (description) => {
        api['warning']({
            message: 'Cảnh báo',
            description: description,
            duration: duration
        });
    }

    const error = (description) => {
        api['error']({
            message: 'Lỗi',
            description: description,
            duration: duration
        });
    }

    const noti = {
        success,
        info,
        warning,
        error
    }

    return [noti, contextHolder];
}

export default useNotification;