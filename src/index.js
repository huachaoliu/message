import css from './index.less';

let maxCount = 10;
let key = 0;
const prefixCls = css.message;
const defaultTop = 15;
const defaultSize = 42;
const destoryTime = 1;

const dc = (nodeName, props) => {
  const dom = document.createElement(nodeName);
  if (props) {
    for (let p in props) {
      dom[p] = props[p];
    }
  }
  return dom;
};

class Message {
  constructor(props) {
    this.htmls = [];
    this._init(props);
  }

  destory() {
    const htmls = this.htmls;
    key--;
    this.htmls = htmls.splice(1);
  }

  _init({ msg, duration, type }) {
    key++;
    let div;
    if (key >= maxCount) {
      div = this.htmls[0];
    } else {
      const cls = `${prefixCls} ${css[type]}`;
      const iconClsPrefix = 'icon iconfont ';
      let iconCls;

      if (type === 'warn') {
        iconCls = `${iconClsPrefix}icon-xinxi`;
      } else if (type === 'success') {
        iconCls = `${iconClsPrefix}icon-xinxi`;
      } else {
        iconCls = `${iconClsPrefix}icon-roundclose`;
      }

      div = document.createElement('div');

      this.htmls.push(div);
      let top = defaultTop;
      if (this.htmls.length > 1) {
        top = defaultTop * key + defaultSize;
      }
      div.setAttribute('data-key', key);
      div.style.top = top + 'px';
      div.className = cls;
      div.innerHTML = `
          <i class="${iconCls}"></i>
          <span class=${css.messageContent}>${msg}</span>
        `;

      this.dom = div;
    }
  }
}

let messageInstance;

let timer;
const destory = (container, msg) => {
  if (timer) return;
  timer = setInterval(() => {
    let len = container.children.length;
    if (len > 0) {
      msg.destory();
      const firstChild = container.firstChild;
      firstChild.classList.add(css.itemRemove);
      const t = setTimeout(() => {
        clearTimeout(t);
        container.removeChild(firstChild);
      }, 200);
    } else {
      clearInterval(timer);
      timer = null;
    }
  }, 500);
};

const getMessageInstance = (msg, duration, type) => {
  const dura = duration || 3;
  const el = new Message({ msg, duration, type });

  if (messageInstance) {
    if (el.dom) {
      messageInstance.appendChild(el.dom);
    }

    const t = setTimeout(() => {
      clearTimeout(t);
      destory(messageInstance, el);
    }, dura * 1000);
    return messageInstance;
  } else {

    const instance = dc('div', { className: css.msgContainer });
    document.body.appendChild(instance);

    instance.appendChild(el.dom);

    messageInstance = instance;
    const t = setTimeout(() => {
      clearTimeout(t);
      destory(instance, el);
    }, dura * 1000);
    return instance;
  }
};

const message = {
  success: (msg, duration) => {
    getMessageInstance(msg, duration, 'success');
  },
  warn: (msg, duration) => {
    getMessageInstance(msg, duration, 'warn');
  },
  error: (msg, duration) => {
    getMessageInstance(msg, duration, 'error');
  },
};

export default {
  success: (msg, duration) => {
    return message.success(msg, duration);
  },
  warn: (msg, duration) => {
    return message.warn(msg, duration);
  },
  error: (msg, duration) => {
    return message.warn(msg, duration);
  }
};