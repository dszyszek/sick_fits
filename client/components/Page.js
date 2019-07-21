import React from "react";

class Page extends React.Component {
    render() {
        return (
            <div>
                <p>_PAGE_ component</p>
                {this.props.children}
            </div>
        );
    }
}

export default Page;