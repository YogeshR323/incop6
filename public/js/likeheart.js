// https://codepen.io/mattbhenley/pen/gQbWgd
// $ means it is using jQuery cdn
// in layout.pug, call to script(src='https://code.jquery.com/jquery-2.2.4.min.js happens before this file

$(function () {
  $('.heart').on('click', function () {
    $(this).toggleClass('is-active')
  })
})

function myFunction(x) {
  x.classList.toggle('fa-heart-o')
}
