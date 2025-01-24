angular.module('my-leave-requests', ['ideUI', 'ideView'])
    .controller('MyLeaveRequests', ['$scope', '$http', function ($scope, $http) {
        $scope.state = {
            isBusy: true,
            error: false,
            busyText: "Loading...",
        };



    }]);