const viewData = {
    id: 'view-leave-balances',
    label: 'View Leave Balances',
    link: '/services/web/codbex-vacations/ext/view/LeaveBalances/leave-balances-view.html',
    perspective: 'LeaveBalance',
    view: 'LeaveBalance',
    type: 'entity',
    order: 13
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}
