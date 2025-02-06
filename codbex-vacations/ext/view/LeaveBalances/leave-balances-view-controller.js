const app = angular.module('templateApp', ['ideUI', 'ideView']);

app.controller('templateController', ['$scope', '$http', 'messageHub', function ($scope, $http, messageHub) {
    $scope.showDialog = true;

    const leaveBalancesUrl = "/services/ts/codbex-vacations/ext/view/LeaveBalances/api/ViewLeaveBalancesService.ts/LeaveBalancesData";

    $http.get(leaveBalancesUrl)
        .then(function (response) {
            $scope.leaveBalances = response.data.LeaveBalances;
        });

    $scope.closeDialog = function () {
        $scope.showDialog = false;
        messageHub.closeDialogWindow("view-leave-balances");
    };

    document.getElementById("dialog").style.display = "block";
}]);
