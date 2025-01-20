const viewData = {
    id: 'leave-deduction-generate',
    label: 'Approve Leave Request',
    link: '/services/web/codbex-vacations/ext/generate/LeaveDeduction/leave-deduction-generate.html',
    perspective: 'LeaveRequests',
    view: 'LeaveRequest',
    type: 'entity',
    order: 13
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}