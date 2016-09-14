var autoselects = document.querySelectorAll(".autoselect")
for (var i = 0; i < autoselects.length; i++) {
    
    autoselects[i].addEventListener('focus', function (event) {
        event.preventDefault()
        this.select()
    })

    autoselects[i].addEventListener("keyup", function(event) {
    	event.preventDefault();
    	if (event.keyCode == 13) {
        	document.getElementById("submit").click();
    	}
    })

    autoselects[i].addEventListener("blur", function(event) {
    	event.preventDefault();
		document.getElementById("submit").click();	
    })
}

var reset = function() {
	document.querySelector("#color").classList.remove("error")
	document.querySelector("#bgColor").classList.remove("error")
}

document.querySelector("#submit").addEventListener("click", function(e){

	reset()

	var color = document.querySelector("#color").value
	var bgColor = document.querySelector("#bgColor").value

	var colorComponents = parseColor(color)
	var backgroundColorComponents = parseBackgroundColor(bgColor)

	var hasError = false

	if (colorComponents.length != 4) {
		hasError = true
		error(document.querySelector("#color"))
	}

	if (backgroundColorComponents.length != 3) {
		hasError = true
		error(document.querySelector("#bgColor"))
	}

	if (hasError) {
		return
	}

	var solidColor = calculateSolidColor(colorComponents, backgroundColorComponents)
	document.querySelector("#result").value = solidColor
	document.querySelector("#result").style.backgroundColor = solidColor
	document.querySelector("#result").style.color = contrast(solidColor)
})

function error(element) {
	element.classList.add("error")
}

function calculateSolidColor(color, background) {
	var alpha = color[0] / 255
	var oneminusalpha = 1 - alpha

	var r = Math.round((color[1] * alpha) + (oneminusalpha * background[0]))
    var g = Math.round((color[2] * alpha) + (oneminusalpha * background[1]))
    var b = Math.round((color[3] * alpha) + (oneminusalpha * background[2]))

    return toHexadecimalColor([r, g, b])
}

function parseColor(color) {
	var result = color.match(/^(#{0,1})([0-9A-F]{8})$/i) 
	if (result == null) {
		return []
	}

	return toDecimalComponents(result[2])
}

function parseBackgroundColor(color) {
	var result = color.match(/^(#{0,1})([0-9A-F]{6})$/i) 
	if (result == null) {
		return []
	}

	return toDecimalComponents(result[2])
}

function splitColor(color) {
	return color.match(/.{1,2}/g)
}

function toDecimalComponents(color) {
	return splitColor(color).map(toDecimal)
}

function toHexadecimalColor(components) {
	return "#" + components.map(toHexadecimal).join('')
}

function toDecimal(hex) {
	return parseInt(hex, 16)
}

function toHexadecimal(decimal) {
	return decimal.toString(16)
}

function contrast(color) {
	var result = yiq(toDecimalComponents(color.substring(1)))
	return (result >= 128) ? '#000000' : '#ffffff'
}

function yiq(components) {
	var r = components[0]
	var g = components[1] 
	var b = components[2]
	var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
	return yiq
}