/**
 * Created by hunte on 12/06/2016.
 */
var mainAppCtrls = angular.module("mainAppCtrls");
/**
 * @ngdoc controller
 * @requires restSvcs.AdminWorkshop
 * @requires restSvcs.Workshops
 * @description Controller for editing a workshop. Initializes resources used to edit a workshop
 * @name mainAppCtrls.controller:AdminEditWorkshopCtrl
 */
mainAppCtrls.controller('AdminEditWorkshopCtrl',['$scope','Workshops','AdminWorkshop','$stateParams','$translate','$alert',
    function($scope,Workshops,AdminWorkshop,$stateParams,$translate,$alert) {

        var _workshopId = $stateParams.id;

        //Initialize _originalData
        var _originalData = {};
        $scope.workshop ={};
        //Get translations for errors and store in array
        var _translations = {};
        //Pass all required translation IDs to translate service
        $translate(['ALERT_WORKSHOP_EDIT_SUCCESS',
            'ALERT_WORKSHOP_EDIT_FAIL','ALERT_WORKSHOP_NOT_FOUND']).
        then(function(translations){
            _translations = translations;
        });

        /**
         * @ngdoc function
         * @name mainAppCtrls.controller:AdminEditWorkshopCtrl#discardChanges
         * @description Discards changes and restores the original data
         * @methodOf mainAppCtrls.controller:AdminEditWorkshopCtrl
         */
        $scope.discardChanges = function () {
            $scope.workshop.title = _originalData.title;
            $scope.workshop.description = _originalData.description;
            $scope.workshop.cost = _originalData.cost;
            $scope.workshop.requirements = _originalData.requirements;
            $scope.workshop.location = _originalData.location;
            $scope.workshop.start_at = _originalData.start_at;
            $scope.workshop.end_at = _originalData.end_at;
            $scope.workshop.max_participants = _originalData.max_participants;




        }

        /**
         * @ngdoc function
         * @name mainAppCtrls.controller:AdminEditWorkshopCtrl#confirmChanges
         * @description Sends changes to the API and stores them as new original data
         * @methodOf mainAppCtrls.controller:AdminEditWorkshopCtrl
         */
        $scope.confirmChanges = function () {
            var _dataToSend = {
                title: '',
                description: '',
                cost: '',
                requirements: '',
                location: '',
                start_at: '',
                end_at: '',
                max_participants: ''

            };
            var _sa = Date.parse($scope.workshop.start_at);
            var _duration = $scope.workshop.duration;
            var _ea = new Date(_sa+_duration + 1000*60*60) ;

            var data = {
                title:$scope.workshop.title,
                description:$scope.workshop.description,
                cost:$scope.workshop.cost,
                requirements:$scope.workshop.requirement,
                location:$scope.workshop.location,
                start_at:reformatDate($scope.workshop.start_at),
                end_at:reformatDate(_ea),
                max_participants:$scope.workshop.max_participants
            };

            //compare all properties of both objects
            if (_changedData.title != _originalData.title)
                _dataToSend.title = _changedData.title;
            if (_changedData.description != _originalData.description)
                _dataToSend.description = _changedData.description;
            if (_changedData.cost != _originalData.cost)
            if (_changedData.location != _originalData.location)
                _dataToSend.location = _changedData.location;
            if (_changedData.start_at != _originalData.start_at)
                _dataToSend.start_at = _changedData.start_at;
            if (_changedData.end_at != _originalData.end_at)
                _dataToSend.end_at = _changedData.end_at;
            if (_changedData.max_participants != _originalData.max_participants)
                _dataToSend.max_participants = _changedData.max_participants;



            Workshops.edit({id: _workshopId}, _dataToSend).$promise.then(function (value) {
                //Store answer from server
                _originalData = {
                    title: value.title,
                    description: value.title,
                    cost: value.title,
                    requirements: value.title,
                    location: value.title,
                    start_at: value.title,
                    end_at: value.end_at,
                    max_participants: value.max_participants

                };
                $alert({
                    title: '',
                    type: 'success',
                    content: _translations.ALERT_WORKSHOP_EDIT_SUCCESS + ' \"' + _originalData.title +'\"',
                    container: '#alert',
                    dismissable: true,
                    show: true,
                    duration: 30
                });
            }, function (httpResponse) {
                $alert({
                    title: '',
                    type: 'danger',
                    content: _translations.ALERT_WORKSHOP_EDIT_FAIL + '(' + httpReponse.status +')',
                    container: '#alert',
                    dismissable: true,
                    show: true,
                    duration: 60
                });
            });
        }

        //Fetch data from API
        $scope.loading = true;
        Workshops.get({id: _workshopId}).$promise.then(function (value) {

            //Store original data in case of discard
            _originalData = {
                title: value.title,
                description: value.description,
                cost: value.cost,
                requirements: value.requirements,
                location: value.location,
                start_at: value.start_at,
                end_at: value.end_at,
                max_participants: value.max_participants

            };
            //Store original data in ng-model
            $scope.workshop.title = _originalData.title;
            $scope.workshop.description = _originalData.description;
            $scope.workshop.cost = _originalData.cost;
            $scope.workshop.requirements = _originalData.requirements;
            $scope.workshop.location = _originalData.location;
            $scope.workshop.start_at = _originalData.start_at;
            $scope.workshop.end_at = _originalData.end_at;
            $scope.workshop.max_participants = _originalData.max_participants;



            $scope.loading = false;
        }, function (httpResponse) {
            if(httpResponse.status === 404)
                $alert({
                    title: '',
                    type: 'danger',
                    content: _translations.ALERT_WORKSHOP_NOT_FOUND,
                    container: '#alert',
                    dismissable: false,
                    show: true
                });

            $scope.loading = false;
        });
    }
]);