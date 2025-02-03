const app = angular.module('templateApp', ['ideUI', 'ideView']);

app.controller('templateController', ['$scope', '$http', 'messageHub', function ($scope, $http, messageHub) {
    $scope.showDialog = true;

    const leaveRequestsUrl = "/services/ts/codbex-vacations/ext/view/LeaveRequests/api/ViewLeaveRequestsService.ts/LeaveRequestsData";

    $http.get(leaveRequestsUrl)
        .then(function (response) {
            $scope.leaveRequests = response.data.LeaveRequests;
        });

    $scope.closeDialog = function () {
        $scope.showDialog = false;
        messageHub.closeDialogWindow("view-leave-requests");
    };

    document.getElementById("dialog").style.display = "block";
}]);