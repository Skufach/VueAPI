window.onload = function () {

    var post_content = new Vue({
        el: '#app',
        data() {
            return {
                searchString: "",
                posts: null,
                users: null
            };

        },
        mounted() {
            axios
                .get('http://jsonplaceholder.typicode.com/posts/')
                .then(response => (this.posts = response.data));
            axios
                .get('http://jsonplaceholder.typicode.com/users/')
                .then(response => (this.users = response.data));
        },

        computed: {
            filteredPosts: function () {
                var posts_array = this.posts,
                    users_array = this.users,
                    searchString = this.searchString,
                    user_name;

                if (!searchString) {
                    return posts_array;
                }

                searchString = searchString.trim().toLowerCase();

                posts_array = posts_array.filter(function (item) {
                    user_name = users_array[item.userId - 1].name;

                    if (user_name.trim().toLowerCase().indexOf(searchString) !== -1) {
                        return item;
                    }
                })

                return posts_array;
            }
        }

    });

}


