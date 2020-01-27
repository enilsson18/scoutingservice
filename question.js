function question(type, optionChoices){
    this.type = type;
    this.options = optionChoices;

    if (this.type == "dropdown"){
        this.data = this.options[0];
    }

    if (this.type == "increment"){
        this.data = 0;
    }

    if (this.type == "text"){
        this.data = "";
    }
}