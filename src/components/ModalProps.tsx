import React, { FC } from "react";

interface Props {
  id: string;
  children: React.ReactNode;
  width?: string
}
const openModal = (id: string) => {
  const modal = document.getElementById(id) as HTMLDialogElement;
  modal?.showModal();
};

const closeModal = (id: string) => {
  const modal = document.getElementById(id) as HTMLDialogElement;
  modal?.close();
};

const ModalProps: FC<Props> = ({ id, children, width }) => {
  return (
    <div>
      <dialog id={id} className="modal modal-middle">
        <div className={`modal-box bg-white ${width} `}>
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕ 
            </button>
          </form>
          <div className="text-black">{children}</div>
        </div>
      </dialog>
    </div>
  );
};

export { closeModal, openModal };
export default ModalProps;
