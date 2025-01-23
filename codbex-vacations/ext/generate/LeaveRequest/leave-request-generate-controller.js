const app = angular.module('templateApp', ['ideUI', 'ideView']);

app.controller('templateController', ['$scope', '$http', 'messageHub', function ($scope, $http, messageHub) {
    $scope.showDialog = true;

    $scope.entity = {};
    $scope.forms = {
        details: {},
    };

    const leaveTypesUrl = "/services/ts/codbex-vacations/gen/codbex-vacations/api/entities/LeaveTypeService.ts/";
    const employeeUrl = "/services/ts/codbex-vacations/ext/generate/LeaveRequest/api/GenerateLeaveRequestService.ts/Employee";
    const managerUrl = "/services/ts/codbex-vacations/ext/generate/LeaveRequest/api/GenerateLeaveRequestService.ts/Manager";
    const leaveRequestUrl = "/services/ts/codbex-vacations/gen/codbex-vacations/api/LeaveRequests/LeaveRequestService.ts/";

    $http.get(leaveTypesUrl)
        .then(function (response) {
            const leaveTypesOptions = response.data;

            $scope.OptionsLeaveType = leaveTypesOptions.map(function (value) {
                return {
                    value: value.Id,
                    text: value.Name
                };
            });
        });


    $scope.generateLeaveRequest = function () {

        const startDate = $scope.entity.StartDate;
        const endDate = $scope.entity.EndDate;
        const days = $scope.entity.Days;
        const type = $scope.entity.Type;
        const reason = $scope.entity.Reason;

        $http.get(employeeUrl)
            .then(function (response) {
                const employee = response.data.Employee;

                $http.get(managerUrl)
                    .then(function (response) {
                        const manager = response.data.Manager;

                        const leaveRequest =
                        {
                            "Employee": employee,
                            "Manager": manager,
                            "StartDate": startDate,
                            "EndDate": endDate,
                            "Days": days,
                            "Type": type,
                            "Status": 1,
                            "Reason": reason,
                        }

                        console.log(leaveRequest);

                        $http.post(leaveRequestUrl, leaveRequest)
                            .then(function (response) {
                                console.log(response.data);
                                $scope.closeDialog();
                            })
                            .catch(function (error) {
                                console.error("Error creating Leave Request", error);
                                $scope.closeDialog();
                            });
                    })
            });

        messageHub.showAlertSuccess("LeaveRequest", "Leave Request successfully created");
    }


    $scope.closeDialog = function () {
        $scope.showDialog = false;
        messageHub.closeDialogWindow("leave-request-generate");
    };

    document.getElementById("dialog").style.display = "block";
}]);