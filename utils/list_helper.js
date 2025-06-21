

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

export default {dummy, totalLikes}