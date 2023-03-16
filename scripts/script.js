let comments = [
    // { name: 'Иван', text: 'Привет', date: new Date(), time: "" },
    // { name: 'Владимир', text: 'Как дела?', date: new Date(), time: "" },
    // { name: 'Петр', text: 'Здравстввуйте!', date: new Date(), time: "" },
]

let comment = {
    id: "",
    name: "",
    text: "",
    date: "",
    time: "",
    like: false
}

let form = document.forms.comment;
let name = form.elements.name;
let text = form.elements.text;
let date = form.elements.date;
let submit = form.elements.submit;
let nameError = true;
let textError = true

const addError = (input, text) => {
    const parent = input.parentNode
    const errorText = document.createElement('label')
    errorText.textContent = text
    errorText.classList.add('error__text')
    parent.append(errorText)
    input.classList.add('error')
}

const removeError = (input) => {
    const parent = input.parentNode
    if (parent.querySelector('.error__text')) {
        parent.querySelector('.error__text').remove()
        input.classList.remove('error')
    }
}

date.oninput = () => {
    const parseDate = Date.parse(date.value)
    comment.date = parseDate
}

name.oninput = () => {
    comment.name = name.value
}

name.onfocus = () => {
    nameError = false
    removeError(name)
}
name.onblur = () => {
    if (name.value.length < 2) {
        nameError = true
        addError(name, "Имя должно быть больше двух символов")
    }
    else if (!/^[a-zA-Zа-яёА-ЯЁ]+$/i.test(name.value)) {
        nameError = true
        addError(name, "Имя не может содержать цифры")
    }
}

text.oninput = () => {
    comment.text = text.value
}

text.onfocus = () => {
    textError = false
    removeError(text)
}

text.onblur = () => {
    if (text.value.length === 0) {
        textError = true
        addError(text, "Комментарий не может быть пустым")
    }
}

const setLike = (id) => {
    console.log("LIKE")
    const comment_item = document.getElementById(id);
    console.log(comment_item)
    const btn = comment_item.querySelector(".like")

    if (btn) {
        console.log(btn)
        btn.classList.add("dislike")
        btn.classList.remove("like")
    }
    else {
        const btn = comment_item.querySelector(".btn__like")
        btn.classList.add("like")
        btn.classList.remove("dislike")
    }
}

const deleteComment = (id) => {
    let newComments = comments.filter(item => item.id !== id)
    comments = newComments
    const comment_item = document.getElementById(id);
    comment_item.remove()
    console.log(comments)
}

const displayComent = (coment, id) => {

    const comment_item = document.createElement('div');
    const comment_item_images = document.createElement('div');
    const avatar = document.createElement('img');
    const comment_item_content = document.createElement('div');
    const content_name = document.createElement('div');
    const content_date = document.createElement('div');
    const content_text = document.createElement('p');
    const btn_like = `<button class='btn__like dislike' onclick='setLike(${comment.id})'></button>`
    const btn_delete = `<button class='btn__delete' onclick='deleteComment(${comment.id})'></button>`

    comment_item.setAttribute("id", `${coment.id}`);
    comment_item.classList.add("comment__item");
    comment_item_images.classList.add("comment__item-images");
    avatar.setAttribute("src", "./images/avatar.jpg");
    avatar.setAttribute("alt", "avatar");
    comment_item_content.classList.add("comment__item-content");
    content_name.classList.add("content__name");
    content_date.classList.add("content__date");
    content_text.classList.add("content__text");

    content_name.innerHTML = coment.name;
    content_date.innerHTML = dateFormatting(coment.date) + " " + coment.time;
    content_text.innerHTML = coment.text;

    comment_item_content.innerHTML = content_name.outerHTML + content_date.outerHTML + content_text.outerHTML + btn_like + btn_delete;
    comment_item_images.innerHTML = avatar.outerHTML;

    comment_item.innerHTML = comment_item_images.outerHTML + comment_item_content.outerHTML;

    const comments_list = document.querySelector('.comments__list');

    comments_list.append(comment_item);
}

const isToday = (date) => {
    const today = new Date()
    const comentDate = new Date(date)
    return comentDate.getDate() === today.getDate() &&
        comentDate.getMonth() === today.getMonth() &&
        comentDate.getFullYear() === today.getFullYear()
}

const isYesterday = (date) => {
    const today = new Date()
    const comentDate = new Date(date)
    return (today.getDate() - comentDate.getDate() === 1) &&
        comentDate.getMonth() === today.getMonth() &&
        comentDate.getFullYear() === today.getFullYear()
}

const dateFormatting = (date) => {
    if (isToday(date)) {
        return "Сегодня"
    }
    else if (isYesterday(date)) {
        return "Вчера"
    }
    else {
        const comentDate = new Date(date)
        return comentDate.getFullYear() + "." +
            (comentDate.getMonth().length === 1 ? comentDate.getMonth() : "0" + comentDate.getMonth()) + "." +
            (comentDate.getDay().length === 1 ? comentDate.getDay() : "0" + comentDate.getDay())
    }
}

form.addEventListener('submit', (event) => {
    event.preventDefault()
    if (!textError && !nameError) {
        const dataTime = new Date()
        if (comment.date === "") {
            comment.date = new Date()
        }
        if (comment.time === "") {
            let hour = dataTime.getHours()
            let minutes = dataTime.getMinutes()
            hour = hour.toString().length === 1 ? ("0" + hour) : hour
            minutes = minutes.toString().length.length === 1 ? ("0" + minutes) : minutes
            comment.time = hour + ":" + minutes
        }
        comment.id = Math.floor(Date.now() * Math.random())
        const newComment = { ...comment }
        comments.push(newComment)
        displayComent(comment, comments.length + 1)
    }
    else {
        if (!document.querySelector(".form__error")) {
            const parent = form.parentNode
            const errorText = document.createElement('label')
            errorText.textContent = "Форма заполнена неверно"
            errorText.classList.add('error__text')
            errorText.classList.add('form__error')
            parent.append(errorText)
            setTimeout(() => {
                parent.querySelector('.form__error').remove()
            }, 1500)
        }
    }
})

