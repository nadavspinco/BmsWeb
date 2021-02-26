package Objects;

import java.util.Objects;

public class Notification extends Message {
    private boolean isPrivate;
    Notification(String header, String content,boolean isPrivate) {
        super(header,content);
        this.isPrivate = isPrivate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Notification that = (Notification) o;
        return isPrivate() == that.isPrivate();
    }

    @Override
    public int hashCode() {
        return Objects.hash(isPrivate());
    }

    public boolean isPrivate(){
        return isPrivate;
    }

}
