const widgetData = {
    id: 'my-leave-requests-widget',
    label: 'My Leave Requests',
    link: '/services/web/codbex-vacations/widgets/my-leave-requests/index.html',
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