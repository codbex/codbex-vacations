angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-vacations/gen/codbex-vacations/api/LeaveRequests/LeaveRequestService.ts';
	}])
	.controller('PageController', ($scope, $http, EntityService, Extensions, LocaleService, ButtonStates) => {
		const Dialogs = new DialogHub();
		let translated = {
			yes: 'Yes',
			no: 'No',
			deleteConfirm: 'Are you sure you want to delete LeaveRequest? This action cannot be undone.',
			deleteTitle: 'Delete LeaveRequest?'
		};

		LocaleService.onInit(() => {
			translated.yes = LocaleService.t('codbex-vacations:codbex-vacations-model.defaults.yes');
			translated.no = LocaleService.t('codbex-vacations:codbex-vacations-model.defaults.no');
			translated.deleteTitle = LocaleService.t('codbex-vacations:codbex-vacations-model.defaults.deleteTitle', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVEREQUEST)' });
			translated.deleteConfirm = LocaleService.t('codbex-vacations:codbex-vacations-model.messages.deleteConfirm', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVEREQUEST)' });
		});
		$scope.dataPage = 1;
		$scope.dataCount = 0;
		$scope.dataOffset = 0;
		$scope.dataLimit = 10;
		$scope.action = 'select';

		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-vacations-custom-action']).then((response) => {
			$scope.pageActions = response.data.filter(e => e.perspective === 'LeaveRequests' && e.view === 'LeaveRequest' && (e.type === 'page' || e.type === undefined));
		});

		$scope.triggerPageAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				maxWidth: action.maxWidth,
				maxHeight: action.maxHeight,
				closeButton: true
			});
		};
		//-----------------Custom Actions-------------------//

		function refreshData() {
			$scope.dataReset = true;
			$scope.dataPage--;
		}

		function resetPagination() {
			$scope.dataReset = true;
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 10;
		}

		//-----------------Events-------------------//
		Dialogs.addMessageListener({ topic: 'codbex-vacations.LeaveRequests.LeaveRequest.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.selectedEntity = null;
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-vacations.LeaveRequests.LeaveRequest.entityCreated', handler: () => {
			refreshData();
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-vacations.LeaveRequests.LeaveRequest.entityUpdated', handler: () => {
			refreshData();
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-vacations.LeaveRequests.LeaveRequest.entitySearch', handler: (data) => {
			resetPagination();
			$scope.filter = data.filter;
			$scope.filterEntity = data.entity;
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		//-----------------Events-------------------//

		$scope.loadPage = (pageNumber, filter) => {
			if (!filter && $scope.filter) {
				filter = $scope.filter;
			}
			if (!filter) {
				filter = {};
			}
			$scope.selectedEntity = null;
			EntityService.count(filter).then((resp) => {
				if (resp.data) {
					$scope.dataCount = resp.data.count;
				}
				$scope.dataPages = Math.ceil($scope.dataCount / $scope.dataLimit);
				filter.$offset = ($scope.dataPage - 1) * $scope.dataLimit;
				filter.$limit = $scope.dataLimit;
				if ($scope.dataReset) {
					filter.$offset = 0;
					filter.$limit = $scope.dataPage * $scope.dataLimit;
				}

				EntityService.search(filter).then((response) => {
					if ($scope.data == null || $scope.dataReset) {
						$scope.data = [];
						$scope.dataReset = false;
					}
					response.data.forEach(e => {
						if (e.StartDate) {
							e.StartDate = new Date(e.StartDate);
						}
						if (e.EndDate) {
							e.EndDate = new Date(e.EndDate);
						}
						if (e.ResolvedAt) {
							e.ResolvedAt = new Date(e.ResolvedAt);
						}
					});

					$scope.data = $scope.data.concat(response.data);
					$scope.dataPage++;
				}, (error) => {
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: LocaleService.t('codbex-vacations:codbex-vacations-model.t.LEAVEREQUEST'),
						message: LocaleService.t('codbex-vacations:codbex-vacations-model.messages.error.unableToLF', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVEREQUEST)', message: message }),
						type: AlertTypes.Error
					});
					console.error('EntityService:', error);
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-vacations:codbex-vacations-model.t.LEAVEREQUEST'),
					message: LocaleService.t('codbex-vacations:codbex-vacations-model.messages.error.unableToCount', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVEREQUEST)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};
		$scope.loadPage($scope.dataPage, $scope.filter);

		$scope.selectEntity = (entity) => {
			$scope.selectedEntity = entity;
			Dialogs.postMessage({ topic: 'codbex-vacations.LeaveRequests.LeaveRequest.entitySelected', data: {
				entity: entity,
				selectedMainEntityId: entity.Id,
				optionsEmployee: $scope.optionsEmployee,
				optionsManager: $scope.optionsManager,
				optionsType: $scope.optionsType,
				optionsStatus: $scope.optionsStatus,
			}});
		};

		$scope.createEntity = () => {
			$scope.selectedEntity = null;
			$scope.action = 'create';

			Dialogs.postMessage({ topic: 'codbex-vacations.LeaveRequests.LeaveRequest.createEntity', data: {
				entity: {},
				optionsEmployee: $scope.optionsEmployee,
				optionsManager: $scope.optionsManager,
				optionsType: $scope.optionsType,
				optionsStatus: $scope.optionsStatus,
			}});
		};

		$scope.updateEntity = () => {
			$scope.action = 'update';
			Dialogs.postMessage({ topic: 'codbex-vacations.LeaveRequests.LeaveRequest.updateEntity', data: {
				entity: $scope.selectedEntity,
				optionsEmployee: $scope.optionsEmployee,
				optionsManager: $scope.optionsManager,
				optionsType: $scope.optionsType,
				optionsStatus: $scope.optionsStatus,
			}});
		};

		$scope.deleteEntity = () => {
			let id = $scope.selectedEntity.Id;
			Dialogs.showDialog({
				title: translated.deleteTitle,
				message: translated.deleteConfirm,
				buttons: [{
					id: 'delete-btn-yes',
					state: ButtonStates.Emphasized,
					label: translated.yes,
				}, {
					id: 'delete-btn-no',
					label: translated.no,
				}],
				closeButton: false
			}).then((buttonId) => {
				if (buttonId === 'delete-btn-yes') {
					EntityService.delete(id).then(() => {
						refreshData();
						$scope.loadPage($scope.dataPage, $scope.filter);
						Dialogs.triggerEvent('codbex-vacations.LeaveRequests.LeaveRequest.clearDetails');
					}, (error) => {
						const message = error.data ? error.data.message : '';
						Dialogs.showAlert({
							title: LocaleService.t('codbex-vacations:codbex-vacations-model.t.LEAVEREQUEST'),
							message: LocaleService.t('codbex-vacations:codbex-vacations-model.messages.error.unableToDelete', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVEREQUEST)', message: message }),
							type: AlertTypes.Error
						});
						console.error('EntityService:', error);
					});
				}
			});
		};

		$scope.openFilter = () => {
			Dialogs.showWindow({
				id: 'LeaveRequest-filter',
				params: {
					entity: $scope.filterEntity,
					optionsEmployee: $scope.optionsEmployee,
					optionsManager: $scope.optionsManager,
					optionsType: $scope.optionsType,
					optionsStatus: $scope.optionsStatus,
				},
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsEmployee = [];
		$scope.optionsManager = [];
		$scope.optionsType = [];
		$scope.optionsStatus = [];


		$http.get('/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts').then((response) => {
			$scope.optionsEmployee = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Employee',
				message: LocaleService.t('codbex-vacations:codbex-vacations-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		$http.get('/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts').then((response) => {
			$scope.optionsManager = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Manager',
				message: LocaleService.t('codbex-vacations:codbex-vacations-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		$http.get('/services/ts/codbex-vacations/gen/codbex-vacations/api/Settings/LeaveTypeService.ts').then((response) => {
			$scope.optionsType = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Type',
				message: LocaleService.t('codbex-vacations:codbex-vacations-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		$http.get('/services/ts/codbex-vacations/gen/codbex-vacations/api/Settings/LeaveStatusService.ts').then((response) => {
			$scope.optionsStatus = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Status',
				message: LocaleService.t('codbex-vacations:codbex-vacations-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		$scope.optionsEmployeeValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsEmployee.length; i++) {
				if ($scope.optionsEmployee[i].value === optionKey) {
					return $scope.optionsEmployee[i].text;
				}
			}
			return null;
		};
		$scope.optionsManagerValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsManager.length; i++) {
				if ($scope.optionsManager[i].value === optionKey) {
					return $scope.optionsManager[i].text;
				}
			}
			return null;
		};
		$scope.optionsTypeValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsType.length; i++) {
				if ($scope.optionsType[i].value === optionKey) {
					return $scope.optionsType[i].text;
				}
			}
			return null;
		};
		$scope.optionsStatusValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsStatus.length; i++) {
				if ($scope.optionsStatus[i].value === optionKey) {
					return $scope.optionsStatus[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//
	});
