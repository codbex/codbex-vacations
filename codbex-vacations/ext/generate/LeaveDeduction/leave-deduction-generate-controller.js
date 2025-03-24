const app = angular.module('templateApp', ['ideUI', 'ideView']);

app.controller('templateController', ['$scope', '$http', 'ViewParameters', 'messageHub', function ($scope, $http, ViewParameters, messageHub) {
    const params = ViewParameters.get();
    let leaveRequestId = params.id || new URLSearchParams(window.location.search).get('id'); // Fallback to URL param

    if (!leaveRequestId) {
        throw new Error("Leave Request ID is missing!");
    }

    const processId = new URLSearchParams(window.location.search).get('processId');

    $scope.showDialog = true;

    const leaveRequestUrl = `/services/ts/codbex-vacations/ext/generate/LeaveDeduction/api/GenerateLeaveDeductionService.ts/leaveRequestData/${leaveRequestId}`;
    const leaveDeductionUrl = "/services/ts/codbex-vacations/gen/codbex-vacations/api/LeaveBalance/LeaveDeductionService.ts/";
    const leaveRequestUpdateUrl = "/services/ts/codbex-vacations/gen/codbex-vacations/api/LeaveRequests/LeaveRequestService.ts/";
    const approvedUrl = `/services/ts/codbex-vacations/ext/generate/LeaveDeduction/api/GenerateLeaveDeductionService.ts/requests/${processId}/approve`;
    const deniedUrl = `/services/ts/codbex-vacations/ext/generate/LeaveDeduction/api/GenerateLeaveDeductionService.ts/requests/${processId}/deny`;


    $http.get(leaveRequestUrl)
        .then(function (response) {
            $scope.LeaveRequest = response.data.LeaveRequest;
            $scope.Vacation = $scope.LeaveRequest.Type == 2;
            $scope.Sick = $scope.LeaveRequest.Type == 1;
            $scope.Casual = $scope.LeaveRequest.Type == 3;
            $scope.Unpaid = $scope.LeaveRequest.Type == 4;
            $scope.IsApproved = $scope.LeaveRequest.Status == 2 || $scope.LeaveRequest.Status == 3;
            $scope.HasEnoughDays = response.data.RemainingLeave >= response.data.LeaveRequest.Days;
            $scope.Employee = response.data.Employee;
            $scope.RequestedDays = response.data.LeaveRequest.Days;
            $scope.StartDate = response.data.StartDate;
            $scope.EndDate = response.data.EndDate;
            $scope.RemainingLeave = response.data.RemainingLeave;
            $scope.LeaveBalances = response.data.LeaveBalances;
            $scope.DeductionsCount = response.data.DeductionsCount;
            $scope.Domain = response.data.Domain;
        });

    $scope.approveLeaveRequest = function () {

        $http.put(approvedUrl).then(function (response) {
            if (response.status !== 200) {
                alert(`Unable to approve request: '${response.message}'`);
                return;
            }
        });

        $scope.LeaveRequest.Status = 2;
        $scope.LeaveRequest.ResolvedAt = new Date().toLocaleDateString('en-CA');

        $http.put(leaveRequestUpdateUrl + $scope.LeaveRequest.Id, $scope.LeaveRequest)
            .then(function (response) {
                console.log(response.data);
                $scope.closeDialog();
            })
            .catch(function (error) {
                console.error("Error updating Leave Request", error);
            });

        if ($scope.Vacation) {
            $scope.generateLeaveDeduction();
        }

    }

    $scope.generateLeaveDeduction = function () {

        if ($scope.LeaveBalances[0].Balance >= $scope.RequestedDays) {

            const leaveDeduction =
            {
                "Id": $scope.DeductionsCount + 1,
                "Balance": $scope.LeaveBalances[0].Id,
                "Request": $scope.LeaveRequest.Id,
                "Days": $scope.RequestedDays
            }

            $http.post(leaveDeductionUrl, leaveDeduction)
                .then(function (response) {
                    console.log(response.data);

                    $scope.IsApproved = true;

                    $scope.closeDialog();
                })
                .catch(function (error) {
                    console.error("Error creating Leave deduction", error);
                });

        } else {

            const oldLeaveBalance = $scope.LeaveBalances[0];
            const newLeaveBalance = $scope.LeaveBalances[1];

            const daysOver = $scope.RequestedDays - oldLeaveBalance.Balance;

            const firstLeaveDeduction =
            {
                "Id": $scope.DeductionsCount + 1,
                "Balance": oldLeaveBalance.Id,
                "Request": $scope.LeaveRequest.Id,
                "Days": oldLeaveBalance.Balance
            }

            const secondLeaveDeduction =
            {
                "Id": $scope.DeductionsCount + 2,
                "Balance": newLeaveBalance.Id,
                "Request": $scope.LeaveRequest.Id,
                "Days": daysOver
            }


            $http.post(leaveDeductionUrl, firstLeaveDeduction)
                .then(function (response) {
                    console.log(response);
                    $scope.IsApproved = true;
                    $scope.closeDialog();
                })
                .catch(function (error) {
                    console.error("Error creating Leave deduction", error);
                });


            $http.post(leaveDeductionUrl, secondLeaveDeduction)
                .then(function (response) {
                    console.log(response);
                    $scope.IsApproved = true;
                    $scope.closeDialog();
                })
                .catch(function (error) {
                    console.error("Error creating Leave deduction", error);
                });
        }
    }

    $scope.rejectLeaveRequest = function () {

        $http.put(deniedUrl).then(function (response) {
            if (response.status !== 200) {
                alert(`Unable to approve request: '${response.message}'`);
                return;
            }
        });

        $scope.LeaveRequest.Status = 3;
        $scope.LeaveRequest.ResolvedAt = new Date().toLocaleDateString('en-CA');

        $http.put(leaveRequestUpdateUrl + $scope.LeaveRequest.Id, $scope.LeaveRequest)
            .then(function (response) {
                console.log(response.data);
                $scope.closeDialog();
            })
            .catch(function (error) {
                console.error("Error updating Leave Request", error);
            });

        $scope.IsApproved = true;
    }

    $scope.closeDialog = function () {

        const redirectUrl = `${$scope.Domain}/services/web/portal/dashboard.html?continue`;

        window.location.href = redirectUrl;

        $scope.showDialog = false;
        messageHub.closeDialogWindow("leave-deduction-generate");
    };

    document.getElementById("dialog").style.display = "block";
}]);