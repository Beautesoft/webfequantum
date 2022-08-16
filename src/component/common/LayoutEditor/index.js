import React from "react";
import { WidthProvider, Responsive } from "react-grid-layout";

const ReactGridLayout = WidthProvider(Responsive);

export class LayoutEditor extends React.PureComponent {
  constructor(props) {
    super(props);

    const layout = this.generateLayout();
    this.state = { layout };
  }

  breakpoints = { lg: 992, md: 768, sm: 576 };

  generateLayout() {
    const fields = this.props.fields;
    return {
      lg: fields.map((e, index) => {
        if (e.layout) {
          let layout = e.layout.lg;
          if (layout.w != 0)
            return {
              x: layout.x,
              y: layout.y,
              w: layout.w,
              h: layout.h,
              i: `${e.id}`,
            };
        }

        return {
          i: `${e.id}`,
          x: (index % 4) * 3,
          y: Math.ceil(index / 4) * 3,
          w: 3,
          h: 3,
        };
      }),
      md: fields.map((e, index) => {
        if (e.layout) {
          let layout = e.layout.md;
          if (layout.w != 0)
            return {
              x: layout.x,
              y: layout.y,
              w: layout.w,
              h: layout.h,
              i: `${e.id}`,
            };
        }
        return {
          i: `${e.id}`,
          x: (index % 3) * 4,
          y: Math.ceil(index / 3) * 3,
          w: 4,
          h: 3,
        };
      }),
      sm: fields.map((e, index) => {
        if (e.layout) {
          let layout = e.layout.sm;
          if (layout.w != 0)
            return {
              x: layout.x,
              y: layout.y,
              w: layout.w,
              h: layout.h,
              i: `${e.id}`,
            };
        }
        return {
          i: `${e.id}`,
          x: index,
          y: 0,
          w: 12,
          h: 3,
        };
      }),
    };
  }

  onLayoutChange = (layout, layouts) => {
    console.log(layout, layouts);
    this.setState({ layout: layouts });
    this.props.onChange(layouts);
  };

  render() {
    return (
      <div className="container-fluid">
        {this.props.editable ? (
          <ReactGridLayout
            className="layout"
            cols={{ lg: 12, md: 12, sm: 12, xs: 1, xxs: 1 }}
            rowHeight={30}
            layouts={this.state.layout}
            onLayoutChange={this.onLayoutChange}
            breakpoints={this.breakpoints}
            margin={[10, 2]}
            {...this.props}
          >
            {this.props.children}
          </ReactGridLayout>
        ) : (
          <ReactGridLayout
            className="layout"
            cols={{ lg: 12, md: 12, sm: 12, xs: 1, xxs: 1 }}
            rowHeight={30}
            layouts={this.state.layout}
            isDraggable={false}
            isResizable={false}
            breakpoints={this.breakpoints}
            {...this.props}
          >
            {this.props.children}
          </ReactGridLayout>
        )}
      </div>
    );
  }
}
