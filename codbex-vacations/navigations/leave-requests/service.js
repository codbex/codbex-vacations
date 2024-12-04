const navigationData = {
    id: 'leave-requests-navigation',
    label: "Leave Requests",
    group: "employees",
    order: 800,
    link: "/services/web/codbex-vacations/gen/codbex-vacations/ui/LeaveRequests/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }