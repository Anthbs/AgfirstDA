'use strict';

/**
 * @ngdoc service
 * @name netLabApp.$API
 * @description
 * # $API
 * Service in the netLabApp.
 */
angular.module('netLabApp').service('$api', function Api($log, $q, $http) {

        var BaseUri = 'http://192.168.16.158/blackbox/public/v1';

        var ConnectionModes = {
            Online: "ONLINE",
            Offline: "OFFLINE"
        }

        var ConnectionMode = ConnectionModes.Online;

        var GoOnline = function() {
            $log.debug("Going online");
            ConnectionMode = ConnectionModes.Online;
        }

        var GoOffline = function() {
            $log.debug("Going offline");
            ConnectionMode = ConnectionModes.Offline;
        }

        var isOnline = function() {
            return ConnectionMode == ConnectionModes.Online;
        }

        window.GoOnline = GoOnline;
        window.GoOffline = GoOffline;
        window.isOnline = isOnline;

        var GetHash = function(data) {
            return md5(JSON.stringify(data));
        }

        var Get = function(url, should_cache) {
            if (should_cache == null) {
                should_cache = true;
            }
            if (isOnline()) {
                $log.debug("Retrieving from api: " + url);
                return $q.when(OnlineGet(url, should_cache));
            } else {
                $log.debug("Retrieving from cache: " + url);
                return $q.when(OfflineGet(url));
            }
        }

        var OnlineGet = function(url, should_cache) {
            var deferred = $q.defer();

            $http.get(url)
                .success(function(result) {
                    if (result.success) {
                        if (should_cache) {
                            var db = TAFFY();
                            db.store(url);
                            var hash = GetHash([url]);
                            db.insert({
                                id: hash,
                                result: result
                            });
                        }
                    }
                    deferred.resolve(result);
                })
                .error(function() {
                    GoOffline();
                    deferred.reject(OfflineGet(url));
                });

            return deferred.promise;
        }

        var OfflineGet = function(url) {
            var db = TAFFY();
            db.store(url);
            var hash = GetHash([url]);
            var cacheItem = db({
                id: hash
            }).get().last();
            if (cacheItem != null) {
                return cacheItem.result;
            } else {
                $log.debug("Unable to find cache item for: " + url);
                return {};
            }
        }

        var Post = function(url, data, should_cache) {
            if (should_cache == null) {
                should_cache = true;
            }
            if (isOnline()) {
                $log.debug("Posting to api: " + url);
                return OnlinePost(url, data, should_cache);
            } else {
                $log.debug("Posting to cache: " + url);
                return $q.when(OfflinePost(url, data));
            }
        }

        var OnlinePost = function(url, data, should_cache) {

            var deferred = $q.defer();

            $http.post(url, data)
                .success(function(result) {
                    if (result.success) {
                        if (should_cache) {
                            var db = TAFFY();
                            db.store(url);
                            var hash = GetHash([url, data]);
                            db.insert({
                                id: hash,
                                result: result
                            });
                        }
                    }
                    deferred.resolve(result);
                })
                .error(function() {
                    GoOffline();
                    deferred.reject(OfflinePost(url, data));
                });

            return deferred.promise;
        }

        var OfflinePost = function(url, data) {
            var db = TAFFY();
            db.store(url);
            var hash = GetHash([url, data]);
            var cacheItem = db({
                id: hash
            }).get().last();
            if (cacheItem != null) {
                return cacheItem.result;
            } else {
                $log.debug("Unable to find cache item for: " + url);
                return {};
            }
        }

        var TaffySyncCache = [];

        var Sync = function() {
            $log.debug("Cache Syncing");
        }

        return {
            Get: Get,
            Post: Post,
            Sync: Sync,
            BaseUri: BaseUri
        };

    });
