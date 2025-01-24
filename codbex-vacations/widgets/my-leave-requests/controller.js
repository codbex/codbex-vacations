angular.module('my-leave-requests', ['ideUI', 'ideView'])
    .controller('MyLeaveRequests', ['$scope', '$http', function ($scope, $http) {
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

    }]);