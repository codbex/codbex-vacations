const viewData = {
    id: 'view-leave-requests',
    label: 'View Leave Requests',
    link: '/services/web/codbex-vacations/ext/view/LeaveRequests/leave-requests-view.html',
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