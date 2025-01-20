const viewData = {
    id: 'codbex-vacations-Reports-RemainingPaidLeave-print',
    label: 'Print',
    link: '/services/web/codbex-vacations/gen/remaining-paid-leave/ui/Reports/RemainingPaidLeave/dialog-print/index.html',
    perspective: 'Reports',
    view: 'RemainingPaidLeave',
    type: 'page',
    order: 10
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}