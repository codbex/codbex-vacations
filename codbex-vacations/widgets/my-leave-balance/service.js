const widgetData = {
    id: 'my-leave-balance-widget',
    label: 'My Leave Balance',
    link: '/services/web/codbex-vacations/widgets/my-leave-balance/index.html',
    lazyLoad: true,
    size: "small"
};

function getWidget() {
    return widgetData;
}

if (typeof exports !== 'undefined') {
    exports.getWidget = getWidget;
}

export { getWidget }