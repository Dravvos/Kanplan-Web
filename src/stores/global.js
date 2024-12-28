import { toast, Slide } from "react-toastify";
import $ from "jquery/dist/jquery.min.js";
import 'react-toastify/dist/ReactToastify.css';
import * as bootstrap from 'bootstrap';

var global = (function () {

    function pb() { }

    pb.ui = (function () {

        function _u() { }

        _u.notification = {
            success: function (msg, timeout) {
                if (pb.util.isNull(timeout)) timeout = 5000;
                if (pb.util.isNull(msg)) msg = " ";

                toast.success(msg, {
                    draggable: false,
                    theme: 'dark',
                    transition: Slide,
                    progress: undefined,
                    autoClose: timeout,
                    pauseOnHover: true,
                    closeOnClick: true,
                    position: 'bottom-center',
                    hideProgressBar: false,
                })
            },

            error: function (msg, timeout) {
                if (pb.util.isNull(timeout)) timeout = 5000;
                if (pb.util.isNull(msg)) msg = " ";

                toast.error(msg, {
                    draggable: false,
                    theme: 'dark',
                    transition: Slide,
                    progress: undefined,
                    autoClose: timeout,
                    pauseOnHover: false,
                    closeOnClick: false,
                    position: 'bottom-center',
                    hideProgressBar: false,
                });
            },
            warning: function (msg, timeout) {
                if (pb.util.isNull(timeout)) timeout = 5000;
                if (pb.util.isNull(msg)) msg = " ";

                toast.warn('msg', {
                    draggable: false,
                    theme: 'dark',
                    transition: Slide,
                    progress: undefined,
                    autoClose: timeout,
                    pauseOnHover: true,
                    closeOnClick: true,
                    position: 'bottom-center',
                    hideProgressBar: false,
                });

            },
            info: function (msg, timeout) {
                if (pb.util.isNull(timeout)) timeout = 5000;
                if (pb.util.isNull(msg)) msg = " ";

                toast.info(msg, {
                    draggable: false,
                    theme: 'dark',
                    transition: Slide,
                    progress: undefined,
                    autoClose: timeout,
                    pauseOnHover: true,
                    closeOnClick: true,
                    position: 'bottom-center',
                    hideProgressBar: false,
                });

            },
            custom: function (msg, timeout, properties) {
                if (pb.util.isNull(timeout)) timeout = 5000;
                if (pb.util.isNull(msg)) msg = " ";

                toast(msg, properties);

            }
        }

        _u.confirm = function (msg, cbOk, cbCancel) {
            var html = `
            <div class="modal fade" id="confirmModal" tabindex="-1" role="dialog" aria-labelledby="confirmModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content main-modal">
                        <div class="modal-header main-text">
                            <h5 class="modal-title" id="confirmModalLabel">Confirmation</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close">
                            </button>
                        </div>
                        <div class="modal-body fs-4 main-text text-center">
                            ${msg}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="button-cancel" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="button" id="confirmOkBtn">OK</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

            // Append the modal to the DOM
            $('body').append(html);

            var confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));

            // Show the modal
            confirmModal.show();

            // Handle OK button click
            $('#confirmOkBtn').on('click', function () {
                if(cbOk) cbOk();
                confirmModal.hide();
            });

            // Handle Cancel action
            $('#confirmModal').on('hidden.bs.modal', function () {
                if(cbCancel) cbCancel();
                $(this).remove(); // Remove the modal from DOM after closing
            });

        }

        _u.showLoading = function (msg) {
            if (pb.util.isNullOrEmpty(msg))
                msg = "Loading ";

            var html = `
            <div class="modal fade" id="loadingModal"  data-bs-keyboard="false" tabindex="-1" role="dialog" data-bs-backdrop="static" aria-labelledby="loadingLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content loading-modal">                        
                        <div class="modal-body fs-3 main-text text-center">
                            ${msg} <i class="fa fa-spinner fa-spin main-text ms-4"></i>
                            <div>
                    </div>
                </div>
            </div>
        `;

            // Append the modal to the DOM
            $('body').append(html);

            var loadingModal = new bootstrap.Modal($('#loadingModal')[0]);

            // Show the modal
            loadingModal.show();
        }

        _u.removeLoading = function () {
            $("#loadingModal").remove();
            $('.modal-backdrop').remove();
        }

        return _u;
    })();

    pb.util = (function () {
        function _u() { }

        _u.isNull = function (obj) {
            return typeof obj === "undefined" || obj === null;
        };

        _u.isNullOrEmpty = function (obj) {
            return _u.isNull(obj) || obj === '';
        };

        _u.isNullOrWhiteSpace = function (obj) {
            return _u.isNull(obj) || obj.trim() === "";
        };

        _u.guidIsNullOrEmpty = function (guid) {
            return _u.isNullOrEmpty(guid) || guid === "00000000-0000-0000-0000-000000000000";
        };

        return _u;
    })();

    pb.event = (function () {
        function _e() {
        }

        _e.onKeyPress = function (selector, keyCode, callback) {
            $(selector).on('keypress', function (e) {
                if (e.keyCode === keyCode) {
                    if (callback)
                        callback(e);
                }
            });
        };

        _e.onPressEnter = function (selector, onPressEnter) {
            _e.onKeyPress(selector, 13, onPressEnter);
        };

        return _e;
    }());

    return pb;
})();

export default global;