angular.module('my-leave-balance', ['ideUI', 'ideView'])
    .controller('MyLeaveBalance', ['$scope', '$http', function ($scope, $http) {
        $scope.state = {
            isBusy: true,
            error: false,
            busyText: "Loading...",
        };

        $scope.today = new Date().toDateString();

        const date = new Date();
        date.setMonth(date.getMonth());
        $scope.currentMonth = date.toLocaleString('default', { month: 'long' });

        $scope.currentYear = new Date().getFullYear();

        const salariesServiceUrl = "/services/ts/codbex-vacations/widgets/api/VacationsService.ts/User";

        $http.get(salariesServiceUrl)
            .then(function (response) {
                console.log(response.data);
                $scope.RemainingLeave = response.data.RemainingLeave;
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