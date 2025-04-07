import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import App from "../App";
import PostList from "../PostList";
import TaskApp from "../TaskReducer";
import TaskReducer from "../TaskReducer";

const ComponentPreviews = () => {
    return (
      <Previews palette={<PaletteTree />}>
        <ComponentPreview path="/App">
          <App />
        </ComponentPreview>
        <ComponentPreview path="/PostList">
          <PostList />
        </ComponentPreview>
        <ComponentPreview path="/TaskApp">
          <TaskApp />
        </ComponentPreview>
        <ComponentPreview path="/TaskReducer">
          <TaskReducer />
        </ComponentPreview>
      </Previews>
    );
}

export default ComponentPreviews