(function () {

    document.addEventListener('DOMContentLoaded', main);

    function main() {

        function menuToggle() {
            document.querySelector('.sidebar-menu').classList.toggle('slided-sidebar-menu');
            document.querySelector('.main-wrpr').classList.toggle('covered');
            transformicons.toggle('.sidebar-menu-btn');
        }

        document.querySelector('.sidebar-menu-btn').addEventListener('click', function (e) {
            e.stopPropagation();
            menuToggle();
        });

        document.querySelector('.main-wrpr').addEventListener('click', function (e) {
            if (document.querySelector('.main-wrpr').classList.contains('covered') && document.querySelector('.sidebar-menu').classList.contains('slided-sidebar-menu')) {
                menuToggle();
            }
        });

        document.querySelector('.sidebar-menu').addEventListener('click', function (e) {
            e.stopPropagation();
        });

    }
})();