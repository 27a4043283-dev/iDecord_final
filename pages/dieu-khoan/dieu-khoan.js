(() => {
const items =
document.querySelectorAll(
".accordion-item"
);

items.forEach(item => {

    const header =
    item.querySelector(
    ".accordion-header"
    );

    header.addEventListener(
    "click",
    () => {

        item.classList.toggle(
        "active"
        );

        const content =
        item.querySelector(
        ".accordion-content"
        );

        if(
            item.classList.contains(
            "active"
            )
        ){

            content.style.maxHeight =
            content.scrollHeight +
            "px";

        }
        else{

            content.style.maxHeight =
            null;

        }

    });

});
})();