export default () => ({
    canvas: null,
    ctx: null,
    cameraOffset: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    cameraZoom: 1,
    MAX_ZOOM: 5,
    MIN_ZOOM: 0.09,
    SCROLL_SENSITIVITY: 0.0003,
    dragging: false,
    dragStart: { x: 0, y: 0 },
    initialPinchDistance: null,
    lastZoom: 1,
    showMenu: false,
    dragStartOffset: { x: 0, y: 0 },
    init() {
        this.canvas = this.$refs.canvas
        this.ctx = this.canvas.getContext('2d')

        // Set canvas dimensions before the image onload event
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight

        // Create a new Image object
        const image = new Image()

        // Wait for the image to load before initializing the finder
        image.onload = () => {
            // Set camera zoom to fit the image width to the window width
            this.cameraZoom = window.innerWidth / image.width

            // Set the initial camera offset to center the image horizontally and vertically
            this.cameraOffset.x = (window.innerWidth - image.width * this.cameraZoom) / 2
            this.cameraOffset.y = (window.innerHeight - image.height * this.cameraZoom) / 2

            console.log('Image dimensions:', image.width, image.height)
            console.log('Canvas dimensions:', this.canvas.width, this.canvas.height)
            console.log('Initial camera zoom:', this.cameraZoom)
            console.log('Initial camera offset:', this.cameraOffset)

            this.draw(image)
        }

        // Set the image source after defining the onload event
        image.src = this.$el.dataset.img
    },
    draw(image) {
        if (!image) return

        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight

        // Reset the transformation matrix
        this.ctx.setTransform(1, 0, 0, 1, 0, 0)

        // Translate to the canvas center before zooming
        this.ctx.translate(window.innerWidth / 2, window.innerHeight / 2)
        this.ctx.scale(this.cameraZoom, this.cameraZoom)
        this.ctx.translate(-this.cameraOffset.x, -this.cameraOffset.y)

        // Clear the canvas
        this.ctx.clearRect(-window.innerWidth, -window.innerHeight, window.innerWidth * 2, window.innerHeight * 2)

        // Draw the image centered
        this.ctx.drawImage(
            image,
            -image.width / 2,
            -image.height / 2
        )

        requestAnimationFrame(() => { this.draw(image) })
    },
    getEventLocation(e) {
        if (e.touches && e.touches.length == 1) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY }
        } else if (e.clientX && e.clientY) {
            return { x: e.clientX, y: e.clientY }
        }
    },
    onPointerDown(e) {
        if (!this.showMenu && e.button == 0) {
            this.dragging = true
            this.dragStart.x = this.getEventLocation(e).x
            this.dragStart.y = this.getEventLocation(e).y
            this.dragStartOffset.x = this.cameraOffset.x
            this.dragStartOffset.y = this.cameraOffset.y
        }
    },
    onPointerUp(e) {
        this.dragging = false
        this.initialPinchDistance = null
        this.lastZoom = this.cameraZoom
    },
    onPointerMove(e) {
        if (this.dragging) {
            this.cameraOffset.x = this.dragStartOffset.x - (this.getEventLocation(e).x - this.dragStart.x) / this.cameraZoom
            this.cameraOffset.y = this.dragStartOffset.y - (this.getEventLocation(e).y - this.dragStart.y) / this.cameraZoom
        }
    },
    handleTouch(e, singleTouchHandler) {
        if (e.touches.length == 1) {
            singleTouchHandler(e)
        } else if (e.type == "touchmove" && e.touches.length == 2) {
            this.isDragging = false
            this.handlePinch(e)
        }
    },
    handlePinch(e) {
        e.preventDefault()

        let touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        let touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY }

        // This is distance squared, but no need for an expensive sqrt as it's only used in ratio
        let currentDistance = (touch1.x - touch2.x) ** 2 + (touch1.y - touch2.y) ** 2

        if (this.initialPinchDistance == null) {
            this.initialPinchDistance = currentDistance
        } else {
            this.adjustZoom(null, currentDistance / this.initialPinchDistance)
        }
    },
    adjustZoom(zoomAmount, zoomFactor) {
        if (!this.isDragging && !this.showMenu) {
            if (zoomAmount) {
                this.cameraZoom -= zoomAmount
            } else if (zoomFactor) {
                this.cameraZoom = zoomFactor * this.lastZoom
            }

            this.cameraZoom = Math.min(this.cameraZoom, this.MAX_ZOOM)
            this.cameraZoom = Math.max(this.cameraZoom, this.MIN_ZOOM)
        }
    },
    openContextMenu(e) {
        e.preventDefault()
        this.$refs.contextMenu.style.left = e.clientX + 'px'
        this.$refs.contextMenu.style.top = e.clientY + 'px'
        this.showMenu = true
    }
})
