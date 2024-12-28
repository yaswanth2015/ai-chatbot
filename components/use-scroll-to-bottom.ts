import { useEffect, useRef, useState, type RefObject } from 'react';

export function useScrollToBottom<T extends HTMLElement>(): [
  RefObject<T>,
  RefObject<T>,
] {
  const containerRef = useRef<T>(null);
  const endRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    const end = endRef.current;

    if (container && end) {
      const observer = new MutationObserver(() => {
        end.scrollIntoView({ behavior: 'instant', block: 'end' });
      });

      observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });

      return () => observer.disconnect();
    }
  }, []);

  return [containerRef, endRef];
}

export function useSetScrollToBottom<T extends HTMLElement>(scrollContainer: RefObject<T>) {
  const [isAtBottom, setAtBottom] = useState<boolean>(true)
  useEffect(()=>{
    const handleScroll = () => {
      const divElement = scrollContainer.current
      if(divElement) {
        const scrollFromTop = divElement.scrollTop
        const clientHeight = divElement.clientHeight
        const scrollHeight =divElement.scrollHeight
        if(Math.ceil(scrollFromTop+clientHeight) >= scrollHeight) {
          setAtBottom(true)
        } else {
          setAtBottom(false)
        }
      }
    }
    if(scrollContainer.current) {
      scrollContainer.current.addEventListener("scroll", handleScroll)
    }
    return () =>{
      if(scrollContainer.current) {
        scrollContainer.current.removeEventListener("scroll", handleScroll)
      }
    }
  },[])
  function goToBottom() {
    const div = scrollContainer.current
    if(div) {
      div.scrollTo({top: div.scrollHeight-div.clientHeight, behavior:"smooth"})
    }
  }
  return {
    isAtBottom: isAtBottom,
    goToBottom: goToBottom
  }
}
