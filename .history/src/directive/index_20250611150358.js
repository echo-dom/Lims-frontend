import hasRole from './permission/hasRole'
import hasPermi from './permission/hasPermi'
import copyText from './common/copyText'
import dialogDragResize from './directives/v-dialog-drag-resize-fullscreen'
export default function directive(app){
  app.directive('hasRole', hasRole)
  app.directive('hasPermi', hasPermi)
  app.directive('copyText', copyText)
  app.directive('dialog-drag-resize-fullscreen', dialogDragResize)
}