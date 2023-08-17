interface Props {
  setNodeRef: (node: HTMLElement) => void;
  style: {
    transition: string;
    transform: string;
  };
}

export const SkeletonCard = ({ setNodeRef, style }: Props) => {
  return (
    <div
      ref={setNodeRef}
      style={style}
      className='opacity-30 bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-rose-500  cursor-grab relative'
    />
  );
};
