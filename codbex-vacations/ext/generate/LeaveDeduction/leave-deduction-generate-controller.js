const app = angular.module('templateApp', ['ideUI', 'ideView']);

app.controller('templateController', ['$scope', '$http', 'ViewParameters', 'messageHub', function ($scope, $http, ViewParameters, messageHub) {
    const params = ViewParameters.get();
    $scope.showDialog = true;

    const leaveRequestUrl = "/services/ts/codbex-vacations/ext/generate/LeaveDeduction/api/GenerateLeaveDeductionService.ts/leaveRequestData/" + params.id;

    $http.get(leaveRequestUrl)
        .then(function (response) {
            $scope.HasEnoughDays = response.data.RemainingLeave > response.data.Days;
            // $scope.HasEnoughDays = false;
            $scope.Employee = response.data.Employee;
            $scope.Days = response.data.Days;
            $scope.StartDate = response.data.StartDate;
            $scope.EndDate = response.data.EndDate;
            $scope.RemainingLeave = response.data.RemainingLeave;
        });

    $scope.generateLeaveDeduction = function () {


    }

    $scope.closeDialog = function () {
        $scope.showDialog = false;
        messageHub.closeDialogWindow("leave-deduction-generate");
    };

    document.getElementById("dialog").style.display = "block";
}]);