angular.module('my-leave-requests', ['ideUI', 'ideView'])
    .controller('MyLeaveRequests', ['$scope', '$http', function ($scope, $http) {
        $scope.state = {
            isBusy: true,
            error: false,
            busyText: "Loading...",
        };

        const salariesServiceUrl = "/services/ts/codbex-vacations/widgets/api/VacationsService.ts/User";

        $http.get(salariesServiceUrl)
            .then(function (response) {
                console.log(response.data);
                $scope.LeaveRequests = response.data.LeaveRequests;
            })
            .catch(function (error) {
                $scope.state.error = true;
                $scope.state.isBusy = false;
                console.error('Error fetching data:', error);
            })
            .finally(function () {
                $scope.state.isBusy = false;
            });


    }]);