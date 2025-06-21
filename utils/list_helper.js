

const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    let total = 0

    //blogs.reduce((sum,blog)=> sum+blog.likes,0)
    /*blogs.forEach(blog => {
        total +=blog.likes
    });*/
    
    for (const blog of blogs) {
        total +=blog.likes
    }

    return total
}



//Favourite blog 

const favoriteBlog = (blogs) => {
    if (blogs.length === 0){
        return null
    }
    let fav = blogs[0]
    for (const blog of blogs) {
        if (blog.likes > fav.likes){
            fav = blog
        }
    }
    return fav
}

//Most Likes
const mostLikes = (blogs) => {
    if (blogs.length === 0){
        return null
    }

    let most = blogs[0]
    let mostLikedAuthor= most.author


    for (const blog of blogs) {
        if (blog.likes > most.likes) {
            mostLikedAuthor = blog.author
            most = blog
        }
    }
    const result = {
        author: mostLikedAuthor,
        likes: most.likes
    }
    return result
}


export default {dummy, totalLikes,favoriteBlog, mostLikes}