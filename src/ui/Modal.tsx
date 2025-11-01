import styled from "styled-components";

const Backdrop = styled.div`
    display: grid;
    place-items: center;

    position: fixed;
    inset: 0;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.45);
    width: 100%;
    height: 100%;

    z-index: 999;
`

const Card = styled.div`
    min-width: 320px; 
    max-width: 520px;
    
    background: ${({theme}) => theme.colors.card};
    border: 1px solid ${({theme}) => theme.colors.border};
    border-radius: 12px;

    padding: 16px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, .55);
`

const Row = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 16px;
`

type Props = {
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    onConfirm: () => void
    onCancel: () => void 
    danger?: boolean
}

export function ConfirmModal({
    title,
    message,
    confirmText='Confirm',
    cancelText='Cancel',
    onConfirm,
    onCancel,
    danger=false,
}: Props){
    return (
        <Backdrop onClick={onCancel}>
            <Card onClick={e => e.stopPropagation()}>
                <h3 style={{margin: '0 0 8px 0'}}>{title}</h3>
                <p style={{opacity: .85}}>{message}</p>
                <Row>
                    <button onClick={onConfirm} style={{background: danger ? "#ef4444" : undefined, color: danger ? '#fff' : undefined, padding: '6px 10px', border: 'none'}}>{confirmText}</button>
                    <button onClick={onCancel}>{cancelText}</button>
                </Row>
            </Card>
        </Backdrop>
    )
}