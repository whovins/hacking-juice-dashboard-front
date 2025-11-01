import styled from "styled-components";
import type { Alert } from "src/entities/alert/type";

const Wrap = styled.aside`
    position: fixed;
    top: 56px;
    right: 0;
    bottom: 0;
    width: 440px;
    padding: 16px;

    background: ${({theme}) => (theme.colors as any).pannel ?? theme.colors.card };
    border-left: 1px solid ${({theme}) => theme.colors.border};
    box-shadow: -8px 0 24px rgba(0, 0, 0, .25);

    overflow: auto;
    z-index: 33;
`

const H3 = styled.h3`
    margin: 0 0 12px 0;
`

const K = styled.p`
    font-size: 12px;
    opacity: .7;
`

const Code = styled.pre`
    background: rgba(0, 0, 0, .2);
    padding: 8px;
    border-radius: 8px;
    overflow: auto;
`

type Props = {
    alert: Alert
    onClose: () => void 
    onAck: () => void 
    onCloseAlert: () => void
}

export function AlertDetailDrawer({
    alert, onClose, onAck, onCloseAlert
}: Props){
    const canAck = alert.status === 'open';
    const canClose = alert.status !== 'closed';

    return (
        <Wrap>
            <H3>Alert #{alert.id}</H3>
            <K>{new Date(alert.ts).toLocaleString()}</K>
            <div style={{margin: '12px 0'}}>
                <b>Severity:</b> {alert.severity.toUpperCase()}<br/>
                <b>Entity:</b> {alert.entity}<br/>
                <b>Status:</b> {alert.status}
            </div>

            <div style={{display: 'flex', gap: 8, marginBottom: 12}}>
                <button onClick={onAck} disabled={!canAck}>Ack</button>
                <button onClick={onCloseAlert} disabled={!canClose}>Close</button>
                <button onClick={onClose} style={{marginLeft: 'auto'}}>Dismiss</button>
            </div>

            <div>
                <b>Matches</b>
                <Code>{JSON.stringify(alert.matches ?? {rule: 'demo', hits: 3}, null, 2)}</Code>
            </div>
        </Wrap>
    )
}
