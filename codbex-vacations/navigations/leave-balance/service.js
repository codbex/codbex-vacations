const navigationData = {
    id: 'leave-balance-navigation',
    label: "Leave Balance",
    group: "employees",
    order: 900,
    link: "/services/web/codbex-vacations/gen/codbex-vacations/ui/LeaveBalance/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }