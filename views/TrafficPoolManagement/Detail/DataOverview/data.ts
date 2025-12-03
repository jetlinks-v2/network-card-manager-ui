import i18n from "@jetlinks-web-core/locales";

const $t = i18n.global.t
export const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4']


export const quickBtnList = [
    {label: $t('Dashboard.index.537937-6'), value: 'yesterday'},
    {label: $t('Dashboard.index.537937-7'), value: 'week'},
    {label: $t('Dashboard.index.537937-8'), value: 'month'},
    {label: $t('Dashboard.index.537937-9'), value: 'year'}
]

export const getTimes = (startTime: number, endTime: number) => {
    let _time = '1m';
    let format = $t('Dashboard.index.537937-13');
    let limit = 12;
    const dt = endTime - startTime;
    const hour = 60 * 60 * 1000;
    const days = hour * 24;
    const months = days * 30;
    const year = 365 * days;
    if (dt <= (hour + 10)) {
        _time = '1h'
        limit = 24
        format = 'HH:mm';
    } else if (dt > hour && dt <= days) {
        _time = '1h'
        limit = 24;

    } else if (dt > days && dt < year) {
        limit = Math.abs(Math.ceil(dt / days)) + 1;
        _time = '1d';
        format = $t('Dashboard.index.537937-14');
    } else if (dt >= year) {
        limit = Math.abs(Math.floor(dt / months));
        _time = '1M';
        format = $t('Dashboard.index.537937-15');
    }

    return {
        time: _time,
        format: format,
        limit: limit,
        from: startTime,
        to: endTime,
    }
}

