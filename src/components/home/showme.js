

const Showme = () => {
    return (
        <div className="d-flex align-items-center justify-content-between">
            <a href="index.html" className="logo d-flex align-items-center">
                <img src={'/assets/img/logo.png'}></img>
                <span className="d-none d-lg-block">NiceAdmin</span>
            </a>
            <i className="bi bi-list toggle-sidebar-btn"></i>
        </div>
    )
}

export default Showme;