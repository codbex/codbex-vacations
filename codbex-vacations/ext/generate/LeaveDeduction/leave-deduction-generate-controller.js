const app = angular.module('templateApp', ['ideUI', 'ideView']);

app.controller('templateController', ['$scope', '$http', 'ViewParameters', 'messageHub', function ($scope, $http, ViewParameters, messageHub) {
    const params = ViewParameters.get();
    $scope.showDialog = true;

    const leaveRequestUrl = "/services/ts/codbex-vacations/ext/generate/LeaveDeduction/api/GenerateLeaveDeductionService.ts/leaveRequestData/" + params.id;
    const leaveDeductionUrl = "/services/ts/codbex-vacations/gen/codbex-vacations/api/LeaveBalance/GenerateLeaveDeductionService.ts/";
    const leaveRequestUpdateUrl = "/services/ts/codbex-vacations/gen/codbex-vacations/api/LeaveRequests/LeaveRequestService.ts/";

    $http.get(leaveRequestUrl)
        .then(function (response) {
            $scope.HasEnoughDays = response.data.RemainingLeave > response.data.LeaveRequest.Days;
            $scope.Employee = response.data.Employee;
            $scope.Days = response.data.LeaveRequest.Days;
            $scope.StartDate = response.data.StartDate;
            $scope.EndDate = response.data.EndDate;
            $scope.RemainingLeave = response.data.RemainingLeave;
            $scope.LeaveBalances = response.data.LeaveBalances;
            $scope.LeaveRequest = response.data.LeaveRequest;
            $scope.DeductionsCount = response.data.DeductionsCount;
        });

    $scope.rejectLeaveRequest = function () {

        $scope.LeaveRequest.Status = 3;
        $scope.LeaveRequest.ApprovalDate = new Date().toLocaleDateString('en-CA');

        $http.put(leaveRequestUpdateUrl + $scope.LeaveRequest.Id, $scope.LeaveRequest)
            .then(function (response) {
                console.log(response.data);
                $scope.closeDialog();
            })
            .catch(function (error) {
                console.error("Error updating Leave Request", error);
            });

    }

    $scope.generateLeaveDeduction = function () {

        if ($scope.LeaveBalances[0].Balance >= $scope.Days) {

            const leaveDeduction =
            {
                "Id": $scope.DeductionsCount + 1,
                "Balance": $scope.LeaveBalances[0].Id,
                "Request": $scope.LeaveRequest.Id,
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
                "Request": $scope.LeaveRequest.Id,
                "Days": days
            }

            const secondLeaveDeduction =
            {
                "Id": $scope.DeductionsCount + 2,
                "Balance": $scope.LeaveBalances[1].Id,
                "Request": $scope.LeaveRequest.Id,
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