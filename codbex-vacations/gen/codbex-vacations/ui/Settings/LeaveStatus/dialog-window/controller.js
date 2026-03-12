angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-vacations/gen/codbex-vacations/api/Settings/LeaveStatusService.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'LeaveStatus successfully created';
		let propertySuccessfullyUpdated = 'LeaveStatus successfully updated';

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'LeaveStatus Details',
			create: 'Create LeaveStatus',
			update: 'Update LeaveStatus'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-vacations:codbex-vacations-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-vacations:codbex-vacations-model.defaults.formHeadSelect', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVESTATUS)' });
			$scope.formHeaders.create = LocaleService.t('codbex-vacations:codbex-vacations-model.defaults.formHeadCreate', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVESTATUS)' });
			$scope.formHeaders.update = LocaleService.t('codbex-vacations:codbex-vacations-model.defaults.formHeadUpdate', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVESTATUS)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-vacations:codbex-vacations-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVESTATUS)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-vacations:codbex-vacations-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVESTATUS)' });
		});

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-vacations.Settings.LeaveStatus.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-vacations:codbex-vacations-model.t.LEAVESTATUS'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-vacations:codbex-vacations-model.messages.error.unableToCreate', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVESTATUS)', message: message });
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.update(id, entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-vacations.Settings.LeaveStatus.entityUpdated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-vacations:codbex-vacations-model.t.LEAVESTATUS'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-vacations:codbex-vacations-model.messages.error.unableToUpdate', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVESTATUS)', message: message });
				});
				console.error('EntityService:', error);
			});
		};


		$scope.alert = (message) => {
			if (message) Dialogs.showAlert({
				title: description,
				message: message,
				type: AlertTypes.Information,
				preformatted: true,
			});
		};

		$scope.cancel = () => {
			$scope.entity = {};
			$scope.action = 'select';
			Dialogs.closeWindow({ id: 'LeaveStatus-details' });
		};

		$scope.clearErrorMessage = () => {
			$scope.errorMessage = null;
		};
	});