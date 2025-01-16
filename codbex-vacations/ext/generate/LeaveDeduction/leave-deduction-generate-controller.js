const app = angular.module('templateApp', ['ideUI', 'ideView']);

app.controller('templateController', ['$scope', '$http', 'ViewParameters', 'messageHub', function ($scope, $http, ViewParameters, messageHub) {
    const params = ViewParameters.get();
    $scope.showDialog = true;

    const leaveRequestUrl = "/services/ts/codbex-vacations/ext/generate/LeaveDeduction/api/GenerateLeaveDeductionService.ts/leaveRequestData/" + params.id;
    const leaveDeductionUrl = "/services/ts/codbex-vacations/gen/codbex-vacations/api/LeaveBalance/GenerateLeaveDeductionService.ts/";


    $http.get(leaveRequestUrl)
        .then(function (response) {
            $scope.HasEnoughDays = response.data.RemainingLeave > response.data.Days;
            $scope.Employee = response.data.Employee;
            $scope.Days = response.data.Days;
            $scope.StartDate = response.data.StartDate;
            $scope.EndDate = response.data.EndDate;
            $scope.RemainingLeave = response.data.RemainingLeave;
            $scope.LeaveBalances = response.data.LeaveBalances;
            $scope.LeaveRequestId = response.data.Id;
            $scope.DeductionsCount = response.data.DeductionsCount;
            console.log($scope.LeaveBalances);
        });

    $scope.generateLeaveDeduction = function () {

        if ($scope.LeaveBalances[0].Balance >= $scope.Days) {

            const leaveDeduction =
            {
                "Id": $scope.DeductionsCount + 1,
                "Balance": $scope.LeaveBalances[0].Id,
                "Request": $scope.LeaveRequestId,
                "Days": $scope.Days
            }

            console.log(leaveDeduction);

            $http.post(leaveDeductionUrl, leaveDeduction)
                .then(function (response) {
                    console.log(response);
                    //call service to update leave balance
                })
                .catch(function (error) {
                    console.error("Error creating Leave deduction", error);
                });

        } else {

            const days = $scope.LeaveBalances[0].Balance - $scope.Days;

            const firstLeaveDeduction =
            {
                "Id": $scope.DeductionsCount + 1,
                "Balance": $scope.LeaveBalances[0].Id,
                "Request": $scope.LeaveRequestId,
                "Days": days
            }

            const secondLeaveDeduction =
            {
                "Id": $scope.DeductionsCount + 2,
                "Balance": $scope.LeaveBalances[1].Id,
                "Request": $scope.LeaveRequestId,
                "Days": $scope.Days - days
            }


            $http.post(leaveDeductionUrl, firstLeaveDeduction)
                .then(function (response) {
                    console.log(response);
                    //call service to update leave balance
                })
                .catch(function (error) {
                    console.error("Error creating Leave deduction", error);
                });


            $http.post(leaveDeductionUrl, secondLeaveDeduction)
                .then(function (response) {

                    console.log(response);
                    //call service to update leave balance
                })
                .catch(function (error) {
                    console.error("Error creating Leave deduction", error);
                });
        }
    }

    $scope.closeDialog = function () {
        $scope.showDialog = false;
        messageHub.closeDialogWindow("leave-deduction-generate");
    };

    document.getElementById("dialog").style.display = "block";
}]);