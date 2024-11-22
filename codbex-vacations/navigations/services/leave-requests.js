const navigationData = {
    id: 'leave-requests-navigation',
    label: "Leave Requests",
    view: "leave-requests",
    group: "employees",
    orderNumber: 1000,
    lazyLoad: true,
    link: "/services/web/codbex-vacations/gen/codbex-vacations/ui/LeaveRequests/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }