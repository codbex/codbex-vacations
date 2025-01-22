const viewData = {
    id: 'leave-request-generate',
    label: 'Add Leave Request',
    link: '/services/web/codbex-vacations/ext/generate/LeaveRequest/leave-request-generate.html',
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